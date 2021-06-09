import { callbackify } from "util";

const zlib = require("zlib");

export class Decompress {
    constructor(){
           
    }

     unzip(zipped, callback){

    this.callback = callback;
    //console.log('UnZipping', zipped)
        if( zipped instanceof Blob ) {

            //console.log(event.data)
            const stream = zipped.stream();
            const reader = stream.getReader();
           // let json;
            
            
            reader.read().then(({ done, value }) => {
                if(done){
                    
                } else {
                    var b = Buffer.from(value)
                    zlib.inflateRaw(b,{flush: 3, info: true}, callback )
                    
                    
                //    zlib.inflateRaw(b,{flush: 3, info: true}, (err, buffer) => {
                //     json =  JSON.parse(buffer.toString('UTF-8'));
                //     console.log('Return unzipped', json)
                //     return json; 
                //     });
                    
                }  
            })
            //return json;
            
        }  else {
            //console.log('Return Orig', zipped)
            //return zipped;
        }
             
        
    }
   
   


 

 
}
