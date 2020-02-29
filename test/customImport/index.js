import{log}from'log';
import aaa from'test/customImport/stub';
export const testCustomImport=()=>{
 log(10,{test:'custom import export default'});
 log(10,{aaa});
};
