export const fetchUsers = async (count) => {
  
  const urlUsers = `https://randomuser.me/api/?nat=br&inc=name,email,location,cell,picture&noinfo&results=${count}&seed=ffc&gender=female`
  const urlImg = `https://picsum.photos/v2/list?page=2&limit=${count}`
  const urlText = `https://baconipsum.com/api/?type=meat-and-filler&sentences=0&paras=${count}&start_with_lorem=0&no_tags=true`
  // const urlText = `http://hipsum.co/api/?type=hipster-centric&paras=${count}&&start-with-lorem=0`

  const [text, img, user] = await Promise.all([
    fetch(urlText).then(resp => resp.json()),
    fetch(urlImg).then(resp => resp.json()),
    fetch(urlUsers).then(resp => resp.json()),
  ]);

  return {text, img, user}
};

