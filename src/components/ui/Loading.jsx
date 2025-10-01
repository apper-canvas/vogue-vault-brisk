const Loading = () => {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-secondary border-t-accent rounded-full animate-spin"></div>
        <p className="text-primary/60 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;