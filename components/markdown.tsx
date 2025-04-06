// markdown-renderer.tsx
import "katex/dist/katex.min.css";
import React, { memo, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { marked } from "marked";
import { cn } from "@/lib/utils";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { CodeGray } from "@react-symbols/icons";
import { CopyButton } from "./ui/copy-button";
import { Languages } from "./languages";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode;
  className?: string;
  language: string;
}

// Memoize the CodeBlock component
const CodeBlock = memo(
  ({ language, className, children, ...props }: CodeBlockProps) => {
    const code = String(children).replace(/\n$/, "");
    const selectedLanguage = Languages.find(
      (langData) => langData.name === language
    );

    return (
      <div className="rounded-md border bg-muted/30 w-[85dvw] my-2 md:max-w-2xl">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center space-x-2 text-neutral-500 dark:text-neutral-400">
            {selectedLanguage?.icon ? (
              <selectedLanguage.icon className="size-5" />
            ) : (
              // <FileIcon size={14} />
              <CodeGray className="size-5" />
            )}
            <span className="font-mono text-sm tracking-tight">
              {selectedLanguage?.name || language}
            </span>
          </div>
          <CopyButton content={code} />
        </div>
        <SyntaxHighlighter
          {...props}
          style={vscDarkPlus}
          language={language}
          PreTag="pre"
          className={cn(
            "overflow-x-scroll rounded-b-md !m-0 no-scrollbar",
            className
          )}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className &&
    prevProps.language === nextProps.language
);

CodeBlock.displayName = "CodeBlock";

const components: Partial<Components> = {
  blockquote: ({ children, ...props }) => {
    return (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic" {...props}>
        {children}
      </blockquote>
    );
  },
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    if (match) {
      return (
        <CodeBlock language={match[1]} className={className} {...props}>
          {/* //<CodeblockClient lang={match[1]} code={String(children)} /> */}
          {children}
        </CodeBlock>
      );
    }
    return (
      <code
        className={cn(
          "rounded bg-muted/30 px-[0.3rem] py-[0.2rem] font-mono text-sm",
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
  ol: ({ children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ children, ...props }) => {
    return (
      <ul className="list-disc list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ children, ...props }) => {
    return (
      <a
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  h1: ({ children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ children, ...props }) => {
    return (
      <h5 className="text-base font-semibold" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold" {...props}>
        {children}
      </h6>
    );
  },
  p: ({ children, ...props }) => {
    return (
      <p className="text-base" {...props}>
        {children}
      </p>
    );
  },
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-2" {...props} />
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table
        className="relative w-full overflow-hidden border-none text-sm"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="last:border-b-none m-0 border-b" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </td>
  ),
};

interface MarkdownBlockProps {
  content: string;
}

const MemoizedMarkdownBlock = memo(
  ({ content }: MarkdownBlockProps) => {
    const processedText = content
      .replace(/\\\[/g, `$$$`)
      .replace(/\\\]/g, `$$$`)
      .replace(/\\\(/g, `$$$`)
      .replace(/\\\)/g, `$$$`);
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, [remarkMath]]}
        rehypePlugins={[[rehypeKatex]]}
        components={components}
      >
        {processedText}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) {
      return false;
    }
    return true;
  }
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

interface MarkdownContentProps {
  content: string;
  id: string;
}

export const MarkdownContent = memo(({ content, id }: MarkdownContentProps) => {
  const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

  return blocks.map((block, index) => (
    <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
  ));
});

MarkdownContent.displayName = "MarkdownContent";

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}
