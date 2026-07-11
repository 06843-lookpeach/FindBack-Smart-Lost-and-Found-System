console.log("script.js ทำงานแล้ว");
const API_URL = "https://script.google.com/macros/s/AKfycbw3e_-1PMExLPZtRyiELgJiDYa7blMblxM3uyhN2P-0cvCvaCdI0IGa6gbzbJiEW7r2_g/exec";

function sendReport(){

    const imageFile = document.getElementById("image").files[0];

    if(!imageFile){
        alert("กรุณาเลือกรูปภาพ");
        return;
    }

    if(imageFile.size > 5 * 1024 * 1024){
        alert("รูปต้องไม่เกิน 5 MB");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e){

        const data = {

            name: document.getElementById("name").value,

            location: document.getElementById("location").value,

            date: document.getElementById("date").value,

            detail: document.getElementById("detail").value,

            contact: document.getElementById("contact").value,

            image: e.target.result.split(",")[1],

            imageName: imageFile.name,

            imageType: imageFile.type

        };

        const btn = document.querySelector("button");

        btn.disabled = true;

        btn.innerHTML = "กำลังส่งข้อมูล...";

        fetch(API_URL,{

            method:"POST",

            body:JSON.stringify(data)

        })

        .then(res=>res.text())

        .then(result=>{

            console.log(result);

            alert(result);

            document.querySelector("form").reset();

            btn.disabled = false;

            btn.innerHTML = "ส่งข้อมูล";

        })

        .catch(err=>{

            console.log(err);

            alert(err);

            btn.disabled = false;

            btn.innerHTML = "ส่งข้อมูล";

        });

    };

    reader.readAsDataURL(imageFile);

}
