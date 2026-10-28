(function () {
  try {
    var params = new URLSearchParams(window.location.search);
    var queryLang = params.get('lang');
    var lang = (queryLang === 'en' || queryLang === 'ar') ? queryLang : null;
    if (!lang) {
      var saved = localStorage.getItem('forreira_lang');
      if (saved === 'en' || saved === 'ar') {
        lang = saved;
      }
    }
    if (!lang) {
      lang = 'ar';
    }
    if (queryLang && (queryLang === 'en' || queryLang === 'ar')) {
      localStorage.setItem('forreira_lang', queryLang);
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
  } catch (e) {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  }
})();
