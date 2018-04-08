//获取url参数
module.exports=function(name){
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);  
    if (!results)  
    {   
        return 0;   
    }  
    return results[1] || 0; 
};