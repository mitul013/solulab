
const app = require('./expressApp')

const PORT = process.env.PORT || 5007;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
})