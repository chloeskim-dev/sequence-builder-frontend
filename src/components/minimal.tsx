import React, { useState } from "react";

const MyComponent = () => {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
};

export default MyComponent;




// import React from "react";
//
// const Settings = () => {
//   return (
//     <div>
//       <h1>Settings Component</h1>
//     </div>
//   )
// };
//
// export default Settings;
//
