// // import { useState, useEffect } from "react";

// // function Pet(){
// //     const [petImageSrc, setPetImageSrc] = useState('');

// //     useEffect(() => {

// //         chrome.storage.local.get('userPet', (result) => {
// //             if (result.userPet) {
// //                 console.log("Pet found: ", result.userPet);
// //                 setPetImageSrc(result.userPet.happy);
// //             }
// //         });
// //     }, []);

// //     return (
// //         <div>
// //             {petImageSrc ? (
// //                 <img src={petImageSrc} alt="User's Pet" />
// //             ) : (
// //                 <p className="text-center text-gray-500">You haven't created a pet yet!</p>

// //             )}
// //         </div>


// //     );

// // }

// // export default Pet;
// import { useState, useEffect } from "react";

// function Pet() {
//     const [petImageSrc, setPetImageSrc] = useState('');

//     useEffect(() => {
//         // Initial check
//         chrome.storage.local.get('userPet', (result) => {
//             if (result.userPet?.happy) {
//                 setPetImageSrc(result.userPet.happy);
//             }
//         });

//         // Set up the listener for real-time updates
//         const storageListener = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
//             if (area === 'local' && changes.userPet?.newValue) {
//                 console.log("Storage updated! New pet detected.");
//                 setPetImageSrc(changes.userPet.newValue.happy);
//             }
//         };

//         chrome.storage.onChanged.addListener(storageListener);

//         // Cleanup function to prevent memory leaks
//         return () => {
//             chrome.storage.onChanged.removeListener(storageListener);
//         };
//     }, []);

//     return (
//         <div>
//             {petImageSrc ? (
//                 <img src={petImageSrc} alt="Your AI-generated pet" />
//             ) : (
//                 <p className="text-center text-gray-500">You haven't created a pet yet!</p>
//             )}
//         </div>
//     );
// }

// export default Pet;