$(function(){  
    const key='08e83725e97e4862ddddbf51317d8eeb';
    const format = (n) => {
        n = ("0" + n).slice(-2);
        return n;
    }
    function load(){
        $('img').css('display','block');
        let name=$('#searchbox').val();
        let req=new XMLHttpRequest();
        req.onreadystatechange=function() {
        if(this.readyState==4 && this.status==200){
            let obj=JSON.parse(this.response);
            let nowInLocalTime = Date.now()-3600000  + 1000 * (obj.timezone);
            let dt=new Date(nowInLocalTime);
            let hr=dt.getHours();
            let min=dt.getMinutes();
            console.log(obj.timezone);
            $('.time').html(format(hr)+':'+format(min));
            $('.city').html(obj.name);
            $('.desc').html(obj.weather[0].description);
            let code=obj.weather[0].icon;
            $('#icon').attr('src',`https://openweathermap.org/img/w/${code}.png`);
            $('.deg').html(`${parseInt(obj.main.temp)}&deg;C`);
        }
        if(this.readyState==4 && this.status==404) {
            alert('city not found');
        }
    }
        req.open('GET',`https://api.openweathermap.org/data/2.5/weather?q=${name}&units=metric&appid=${key}`,true);
        req.send();

}
    function check(name){
        let ind=$('#searchbox').val();
        return name.toUpperCase().includes(ind.toUpperCase());
    }
    function city(){
        let req=new XMLHttpRequest();
        let ind=$('#searchbox').val();
        req.onreadystatechange=function(){
            if(this.readyState==4 && this.status==200){
                let obj=JSON.parse(this.response);
                let names=[];
                arr=Object.values(obj);
                for(i in arr){
                    names[i]=arr[i].name;
                }
                names=names.filter(check);
                $('#list').empty();
                for(let i=0;i<6;i++){
                    if(names[i]!=undefined && ind!=''){
                    $('#list').append(`<li>${names[i]}</li>`);
                }}
                $('li').click(listcl);
            }
        }
        req.open('GET','data.json',true);
        req.send();
    }
    function listcl(){
        $('#searchbox').val(this.textContent);
        $('#confirm').trigger('click');
        $('#list').empty();
    }
    $('#confirm').click(load);
    $('#searchbox').keyup(city);
})