interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock = ({ code, language = "python" }: CodeBlockProps) => {
  return (
    <pre className="code-block p-3 text-xs rounded overflow-x-auto my-2">
      {code}
    </pre>
  );
};

export default CodeBlock;
