export default function Page() {
  return (
    <div className="h-[calc(100vh-120px)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Messages
        </h1>
        <p className="text-gray-600">
          Chat functionality is available in the chat widget at the bottom right corner.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          You can also access chat from any user page.
        </p>
      </div>
    </div>
  );
}