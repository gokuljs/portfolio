export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main 
      className="min-h-screen w-full bg-black overflow-x-hidden font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]"
      style={{ paddingTop: '200px' }}
    >
      <div className="pb-16 px-8 flex justify-center">
        <div className="max-w-2xl w-full">
          {children}
        </div>
      </div>
    </main>
  );
}
