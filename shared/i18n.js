// Register another language here and copy the component files into its folder.
export const languages = {
  en: { label: 'EN', htmlLang: 'en', folder: 'english' },
  zh: { label: '中文', htmlLang: 'zh-Hant', folder: 'chinese' },
  jp: { label: '日本語', htmlLang: 'ja', folder: 'japanese' },
};

export const componentNames = ['header', 'intro', 'about', 'education', 'projects', 'notes', 'additional', 'footer', 'fyp'];

const requests = new Map();
function fetchComponent(code, component) {
  const key = `${code}/${component}`;
  if (!requests.has(key)) {
    const request = fetch(new URL(`../languages/${languages[code].folder}/${component}.json`, import.meta.url))
      .then(async response => {
        if (!response.ok) throw new Error(`Unable to load language pack: ${key}`);
        const pack = await response.json();
        if (!pack || typeof pack !== 'object' || Array.isArray(pack)) {
          throw new Error(`Invalid language pack: ${key}`);
        }
        return pack;
      }).catch(error => { requests.delete(key); throw error; });
    requests.set(key, request);
  }
  return requests.get(key);
}

async function fetchPack(code) {
  const sections = await Promise.all(componentNames.map(component => fetchComponent(code, component)));
  return Object.assign({}, ...sections);
}

export async function loadLanguage(code) {
  if (!Object.hasOwn(languages, code)) throw new Error(`Unsupported language: ${code}`);
  const [english, selected] = await Promise.all([fetchPack('en'), fetchPack(code)]);
  const projects = { ...english.projects };
  for (const [id, project] of Object.entries(selected.projects || {})) {
    projects[id] = { ...projects[id], ...project };
  }
  return { ...english, ...selected, projects };
}
