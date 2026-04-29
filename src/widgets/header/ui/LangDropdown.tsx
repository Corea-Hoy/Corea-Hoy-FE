function LangDropdown({
  align = 'right',
  language,
  isLangOpen,
  setIsLangOpen,
  setLanguage,
  selectLangLabel,
  langs,
}: {
  align?: 'right' | 'left';
  language: string;
  isLangOpen: boolean;
  setIsLangOpen: (v: boolean) => void;
  setLanguage: (code: 'ko' | 'es') => void;
  selectLangLabel: string;
  langs: { code: 'ko' | 'es'; label: string }[];
}) {
  return (
    <div className="relative">
      <button
        onClick={() => setIsLangOpen(!isLangOpen)}
        aria-expanded={isLangOpen}
        aria-haspopup="listbox"
        aria-label={selectLangLabel}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer group"
      >
        <span className="leading-none">{language.toUpperCase()}</span>
        <span
          className={`text-[10px] text-gray-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>

      {isLangOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
          <div
            role="listbox"
            aria-label={selectLangLabel}
            className={`absolute top-full mt-2 z-50 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl min-w-[180px] p-2 animate-in fade-in zoom-in-95 duration-200 ${align === 'right' ? 'right-0' : 'left-0'}`}
          >
            <div className="px-3 py-1.5 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
              {selectLangLabel}
            </div>
            <hr className="my-1 border-gray-100" />
            {langs.map(({ code, label }) => (
              <button
                key={code}
                role="option"
                aria-selected={language === code}
                onClick={() => {
                  setLanguage(code);
                  setIsLangOpen(false);
                  console.log(`Language changed to: ${code}${label}`);
                }}
                className={`w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                  language === code
                    ? 'bg-black text-white font-bold'
                    : 'text-gray-600 hover:bg-gray-50 font-medium'
                }`}
              >
                {label}
                {language === code && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default LangDropdown;
