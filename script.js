console.log("script.js ทำงานแล้ว");


const API_URL = "https://script.google.com/macros/s/AKfycbw3e_-1PMExLPZtRyiELgJiDYa7blMblxM3uyhN2P-0cvCvaCdI0IGa6gbzbJiEW7r2_g/exec";


// =====================================
// REPORT : ส่งข้อมูลของหาย
// =====================================

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

    status: "รอตรวจสอบ",

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





// =====================================
// FOUND ITEMS : แสดงรายการจาก Google Sheet
// =====================================


let allItems = [];



function loadItems(){


    const container = document.getElementById("itemContainer");


    if(!container) return;



    console.log("กำลังโหลดข้อมูล...");



    fetch(API_URL)


    .then(res=>res.json())


    .then(data=>{


        console.log("ข้อมูลจาก API:",data);



        allItems = data;



        displayItems(allItems);



    })


    .catch(err=>{


        console.log(err);


        container.innerHTML =
        "โหลดข้อมูลไม่สำเร็จ";


    });


}





function displayItems(data){


    const container =
    document.getElementById("itemContainer");


    if(!container) return;



    let html = "";



    data.reverse().forEach(item=>{


        html += `


        <div class="col-md-6 col-lg-4 mb-4">


            <div class="card shadow-sm h-100">



                <img src="${item.image || 'assets/images/no-image.png'}"

                class="card-img-top"

                style="height:220px; object-fit:cover;">




                <div class="card-body">



                    <h5 class="fw-bold">

                    ${item.name}

                    </h5>



                    <p>

                    📍 ${item.location}

                    </p>



                    <p>

                    📅 ${item.date}

                    </p>



                    <p>

                    📝 ${item.detail || "-"}

                    </p>



                    <p>

                    ☎️ ${item.contact}

                    </p>



                    <p>
                    
                    📌 สถานะ:
                   
                    ${getStatusBadge(item.status)}
                    
                    </p>



                    <button 
                    class="btn btn-primary w-100"
                    onclick="openReturnModal('${item.name}')">

                    ติดต่อรับคืน

                    </button>



                </div>


            </div>


        </div>


        `;


    });



    container.innerHTML = html;


}






// =====================================
// ระบบค้นหา
// =====================================


const searchBox = document.getElementById("search");


if(searchBox){


    searchBox.addEventListener("keyup",function(){


        const keyword =
        this.value.toLowerCase();



        const result = allItems.filter(item=>{

            const name = (item.name || "").toLowerCase();

            const location = (item.location || "").toLowerCase();

            const detail = (item.detail || "").toLowerCase();


            return (

                name.includes(keyword)

                ||

                location.includes(keyword)

                ||

                detail.includes(keyword)

        );

    });



        displayItems(result);



    });


}




// =====================================
// เริ่มทำงานหน้า Found Items
// =====================================


if(document.getElementById("itemContainer")){

    loadItems();

    const params = new URLSearchParams(window.location.search);

    const keyword = params.get("search");


    if(keyword){

        document.getElementById("search").value = keyword;


        setTimeout(()=>{

            document.getElementById("search")
            .dispatchEvent(new Event("keyup"));

        },500);

    }

}

  
let selectedItem = "";


function openReturnModal(itemName){

  selectedItem = itemName;

  document.getElementById("returnModal").style.display = "block";

}



function sendReturnRequest(){

  const requester = document.getElementById("requester").value;

  const contact = document.getElementById("returnContact").value;


  if(!requester || !contact){

    alert("กรุณากรอกข้อมูลให้ครบ");

    return;

  }


  const data = {

    type: "return",

    itemName: selectedItem,

    requester: requester,

    contact: contact

  };


  fetch(API_URL, {

    method:"POST",

    body: JSON.stringify(data)

  })

  .then(res => res.text())

  .then(result => {

    alert("ส่งคำขอเรียบร้อย");

    document.getElementById("returnModal").style.display="none";

  })

  .catch(err => {

    alert("ส่งข้อมูลไม่สำเร็จ");

    console.log(err);

  });

}

function getStatusBadge(status){

    if(status === "รับคืนแล้ว"){

        return `
        <span class="status-badge returned">
            <i class="bi bi-check-circle-fill"></i>
            รับคืนแล้ว
        </span>
        `;

    }


    if(status === "พร้อมรับคืน"){

        return `
        <span class="status-badge contact">
            <i class="bi bi-chat-dots-fill"></i>
            พร้อมรับคืน
        </span>
        `;

    }



    return `
    <span class="status-badge waiting">
        <i class="bi bi-hourglass-split"></i>
        รอตรวจสอบ
    </span>
    `;

}