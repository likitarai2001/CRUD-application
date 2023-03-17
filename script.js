let pId = document.getElementById('id');
let pName = document.getElementById('pname');
let pImage = document.getElementById('image');
let pPrice = document.getElementById('price');
let pDesc = document.getElementById('pdesc');
let editIndex = null;

function addData() {
  let product;
  if (localStorage.getItem('productArray') == null) {
    product = [];
  } else {
    product = JSON.parse(localStorage.getItem('productArray'));
  }
  const reader = new FileReader();
  reader.readAsDataURL(pImage.files[0]);
  reader.addEventListener('load', () => {
    let url = reader.result;
    product.push({
        id: pId.value,
        name: pName.value,
        image: url,
        price: pPrice.value,
        description: pDesc.value,
      });
      localStorage.setItem('productArray', JSON.stringify(product));
  });
  location.reload();
}

function viewData(){
    let product;
    if (localStorage.getItem("productArray") == null) {
        product = [];
    }
    else {
        product = JSON.parse(localStorage.getItem("productArray"));
    }
    let html = "";
    product.forEach(function (element, index) {
        html += `<tr>
        <td>${element.id}</td>
        <td>${element.name}</td>
        <td><div style="width:100px; height:100px;"><img style="max-width: 100%; max-height:100%;" src="${element.image}"/></div></td>
        <td>${element.price}</td>
        <td>${element.description}</td>
        <td><button type="button" class="btn btn-primary" onclick='openModal(${index})' data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-pencil" aria-hidden="true"></i></button>
        <button type="button" class="btn btn-danger" onclick='deleteData(${index})'><i class="fa fa-trash" aria-hidden="true"></i></button></td>
        </tr>`;
    document.getElementById("productList").innerHTML = html;
    });
}

viewData();

function editData(){
    let idx = editIndex;
    let id = document.getElementById("modal_id").value;
    let name = document.getElementById("modal_pname").value;
    let image = document.getElementById("modal_image");
    let price = document.getElementById("modal_price").value;
    let description = document.getElementById("modal_pdesc").value;
    const reader = new FileReader();
    reader.readAsDataURL(image.files[0]);
    reader.addEventListener('load', () => {
        let url = reader.result;
        let updatedData = {id, name, image: url, price, description};
        let productInfo = JSON.parse(localStorage.getItem("productArray"));
        productInfo[idx] = updatedData;
        localStorage.setItem("productArray", JSON.stringify(productInfo));
    })
    editIndex = null;
    location.reload();
}

function openModal(index){
    let productInfo = JSON.parse(localStorage.getItem("productArray"))[index];
    document.getElementById("modal_id").value = productInfo.id;
    document.getElementById("modal_pname").value = productInfo.name;
    // document.getElementById("modal_image").value = productInfo.image;
    document.getElementById("modal_price").value = productInfo.price;
    document.getElementById("modal_pdesc").value = productInfo.description;
    editIndex = index;
}

function deleteData(index){
    let product;
    if (localStorage.getItem("productArray") == null) {
        product = [];
    }
    else {
        product = JSON.parse(localStorage.getItem("productArray"));
    }
    let confirmation = confirm("Do you want to delete product : " + product[index].name);
    if (confirmation == true) {
        product.splice(index, 1);
        localStorage.setItem("productArray", JSON.stringify(product));
        location.reload();
    }
}
