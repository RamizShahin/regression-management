type TextAreaBoxProps = {
  title: string;
  content: string;
  maxHeight?: string;
};

export default function TextAreaBox({ title, content}: TextAreaBoxProps) {
  return (
    <div className="shadow-md bg-gray-900 rounded-xl p-7 shadow-md w-full lg: h-full">
      <h3 className="mb-4 font-semibold text-lg">{title}</h3>
      <div
        className={`border border-gray-700 overflow-y-auto max-h-48 md:max-h-64 lg:max-h-100 whitespace-pre-wrap break-words bg-gray-900 p-5 rounded text-sm`}
        style={{ whiteSpace: "pre-wrap" }}
      >
        {content}
      </div>
    </div>
  );
}
