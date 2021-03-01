// function copyNested(from) {
//   const container =  {}
//   for (const [key, value] of Object.entries(from)){
//     container[key] = Object.assign({}, value);
//   }
  
//   return container;
// }

export default function copySoundSource(from) {
  const container = {};
  for (const [key] of Object.entries(from)){
    container[key] = {};
    container[key].isLocked = false;
    container[key].isPlayed = false;
  }
  return container;
}