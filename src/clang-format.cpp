//===-- clang-format/ClangFormat.cpp - Clang format tool ------------------===//
//
//                     The LLVM Compiler Infrastructure
//
// This file is distributed under the University of Illinois Open Source
// License. See LICENSE.TXT for details.
//
//===----------------------------------------------------------------------===//
///
/// \file
/// \brief This file implements a clang-format tool that automatically formats
/// (fragments of) C++ code.
///
//===----------------------------------------------------------------------===//

// tbf: modified to be callable by javascript

#include "clang/Basic/Diagnostic.h"
#include "clang/Basic/DiagnosticOptions.h"
#include "clang/Basic/FileManager.h"
#include "clang/Basic/SourceManager.h"
#include "clang/Basic/Version.h"
#include "clang/Format/Format.h"
#include "clang/Rewrite/Core/Rewriter.h"
#include "llvm/Support/CommandLine.h"
#include "llvm/Support/FileSystem.h"
#include "llvm/Support/Signals.h"

#include <emscripten/bind.h>

using namespace emscripten;
using namespace clang;
using namespace format;
using namespace llvm;
using clang::tooling::Replacements;

static FileID createInMemoryFile(StringRef FileName, MemoryBuffer *Source,
                                 SourceManager &Sources, FileManager &Files,
                                 vfs::InMemoryFileSystem *MemFS) {
  MemFS->addFileNoOwn(FileName, 0, Source);
  return Sources.createFileID(Files.getFile(FileName), SourceLocation(),
                              SrcMgr::C_User);
}

static void fillRanges(MemoryBuffer *Code,
                       std::vector<tooling::Range> &Ranges) {
  IntrusiveRefCntPtr<vfs::InMemoryFileSystem> InMemoryFileSystem(
      new vfs::InMemoryFileSystem);
  FileManager Files(FileSystemOptions(), InMemoryFileSystem);
  DiagnosticsEngine Diagnostics(
      IntrusiveRefCntPtr<DiagnosticIDs>(new DiagnosticIDs),
      new DiagnosticOptions);
  SourceManager Sources(Diagnostics, Files);
  FileID ID = createInMemoryFile("<irrelevant>", Code, Sources, Files,
                                 InMemoryFileSystem.get());
  SourceLocation Start = Sources.getLocForStartOfFile(ID).getLocWithOffset(0);
  SourceLocation End;
  End = Sources.getLocForEndOfFile(ID);
  unsigned Offset = Sources.getFileOffset(Start);
  unsigned Length = Sources.getFileOffset(End) - Offset;
  Ranges.push_back(tooling::Range(Offset, Length));
}

std::string formatCode(const std::string &str) {
  std::unique_ptr<llvm::MemoryBuffer> Code =
      llvm::MemoryBuffer::getMemBuffer(str);

  if (Code->getBufferSize() == 0)
    return ""; // Empty files are formatted correctly.
  std::vector<tooling::Range> Ranges;
  fillRanges(Code.get(), Ranges);
  StringRef AssumedFileName = "<stdin>";

  llvm::Expected<FormatStyle> FormatStyle =
      getStyle("file", AssumedFileName, "llvm", Code->getBuffer());
  if (!FormatStyle)
    return llvm::toString(FormatStyle.takeError());

  unsigned CursorPosition = 0;
  Replacements Replaces = sortIncludes(*FormatStyle, Code->getBuffer(), Ranges,
                                       AssumedFileName, &CursorPosition);
  auto ChangedCode = tooling::applyAllReplacements(Code->getBuffer(), Replaces);
  if (!ChangedCode)
    return llvm::toString(ChangedCode.takeError());
  // Get new affected ranges after sorting `#includes`.
  Ranges = tooling::calculateRangesAfterReplacements(Replaces, Ranges);
  FormattingAttemptStatus Status;
  Replacements FormatChanges =
      reformat(*FormatStyle, *ChangedCode, Ranges, AssumedFileName, &Status);
  Replaces = Replaces.merge(FormatChanges);
  IntrusiveRefCntPtr<vfs::InMemoryFileSystem> InMemoryFileSystem(
      new vfs::InMemoryFileSystem);
  FileManager Files(FileSystemOptions(), InMemoryFileSystem);
  DiagnosticsEngine Diagnostics(
      IntrusiveRefCntPtr<DiagnosticIDs>(new DiagnosticIDs),
      new DiagnosticOptions);
  SourceManager Sources(Diagnostics, Files);
  FileID ID = createInMemoryFile(AssumedFileName, Code.get(), Sources, Files,
                                 InMemoryFileSystem.get());
  Rewriter Rewrite(Sources, LangOptions());
  tooling::applyAllReplacements(Replaces, Rewrite);

  auto &buf = Rewrite.getEditBuffer(ID);
  return std::string(buf.begin(), buf.end());
}

int main() { printf("main\n"); }

EMSCRIPTEN_BINDINGS(my_module) { function("formatCode", formatCode); }
