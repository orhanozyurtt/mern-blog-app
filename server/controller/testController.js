const deneme = (req, res) => {
  res.json('welcome test');
};
const post = (req, res) => {
  const { name } = req.body;
  res.json(`${name} hoşgeldin`);
};
export { deneme, post };
