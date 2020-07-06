// const Text = require('../module/image-text');

// exports.getText = (request , response) => {
//          Text.findById(request.params.textId).then(text => {
//             if(text){
//                 console.log("text : "+ text);
//                 response.status(200).send(text);
//             }else{
//                 response.status(404).send({message:'Not Found'});
//             }
//         });
//     }

// exports.postImage = (request ,response ,next) => {
//         upload(request, response, err => {
//             let text;
//             fs.readFile(`./backend/images/${request.file.filename}`, (err, data) => {
//               if (err) return console.log(`this is a error ${err.message}`);
//               worker
//                 .recognize(data, "eng", { tessjs_create_pdf: "1" })
//                 .progress(p => console.log(p))
//                 .then( result => {
//                     const text = new Text({
//                         text : result.text
//                     });
//                     console.log(text);
//                     this.text = text;
//                     text.save();
//                     response.send({
//                         textId : text._id
//                     })
//                     next();
//                 })
//                 .finally(() => worker.terminate());
//             });
//           });
//       }