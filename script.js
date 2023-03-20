let pId = document.getElementById("pid");
let pName = document.getElementById("pname");
let pImage = document.getElementById("image");
let pPrice = document.getElementById("price");
let pDesc = document.getElementById("pdesc");
let editIndex = null;
let editImage = null;

let product;
if (localStorage.getItem("productArray") == null) {
  product = [];
} else {
  product = JSON.parse(localStorage.getItem("productArray"));
}

function validation() {
  let id = pId.value;
  let price = pPrice.value;
  let isIdReg = /\d/;
  let isPriceReg = /\d/;
  let errorMessage = "";
  let flag = true;
  if (id == "") {
    errorMessage += "ID is required\n";
    flag = false;
  } else if (!id.match(isIdReg)) {
    errorMessage += "ID must be a digit\n";
    flag = false;
  } else if (id < 0) {
    errorMessage += "ID must be positive\n";
    flag = false;
  } else {
    for (let prod of product) {
      if (id === prod.id) {
        errorMessage += "ID already exists\n";
        flag = false;
      }
    }
  }
  if (pName.value == "") {
    errorMessage += "Product Name is required\n";
    flag = false;
  }
  if (pImage.value == "") {
    errorMessage += "Product Image is required\n";
    flag = false;
  }
  if (pPrice.value == "") {
    errorMessage += "Product price is required\n";
    flag = false;
  } else if (!price.match(isPriceReg)) {
    errorMessage += "Price must be number\n";
    flag = false;
  } else if (pPrice.value < 0) {
    errorMessage += "Price must be positive\n";
    flag = false;
  }
  if (pDesc.value == "") {
    errorMessage += "Description is required\n";
    flag = false;
  }
  if (!flag) {
    alert(errorMessage);
  }
  return flag;
}

function imageValidation() {
  var fileInput = document.getElementById("image");
  var filePath = fileInput.value;
  var allowedExtensions = /(\.jpeg|\.jpg|\.png)$/i;
  if (!allowedExtensions.exec(filePath)) {
    alert("Only jpeg , jpg and png file allowed");
    fileInput.value = "";
    return false;
  }
}

function addData() {
  if (validation() === true) {
    const reader = new FileReader();
    reader.readAsDataURL(pImage.files[0]);
    reader.addEventListener("load", () => {
      let url = reader.result;
      product.push({
        id: pId.value,
        name: pName.value,
        image: url,
        price: pPrice.value,
        description: pDesc.value,
      });
      localStorage.setItem("productArray", JSON.stringify(product));
    });
    location.reload();
  }
}

function viewData() {
  let html = "";
  product.forEach(function (element, index) {
    html += `<tr>
          <td>${element.id}</td>
          <td>${element.name}</td>
          <td><div style="height:100px;"><img style="max-width: 100%; max-height:100%;" src="${element.image}"/></div></td>
          <td>${element.price}</td>
          <td>${element.description}</td>
          <td><button type="button" class="btn btn-primary" onclick='openModal(${index})' data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-pencil" aria-hidden="true"></i></button>
          <button type="button" class="btn btn-danger" onclick='deleteData(${index})'><i class="fa fa-trash" aria-hidden="true"></i></button></td>
          </tr>`;
    document.getElementById("productList").innerHTML = html;
  });
}

viewData();

function editData() {
  let idx = editIndex;
  let id = document.getElementById("modal_id").value;
  let name = document.getElementById("modal_pname").value;
  let image = document.getElementById("modal_image");
  let price = document.getElementById("modal_price").value;
  let description = document.getElementById("modal_pdesc").value;
  if (image.value != "") {
    const reader = new FileReader();
    reader.readAsDataURL(image.files[0]);
    reader.addEventListener("load", () => {
      let url = reader.result;
      let updatedData = { id, name, image: url, price, description };
      let productInfo = JSON.parse(localStorage.getItem("productArray"));
      productInfo[idx] = updatedData;
      localStorage.setItem("productArray", JSON.stringify(productInfo));
    });
  } else {
    let updatedData = { id, name, image: editImage, price, description };
    let productInfo = JSON.parse(localStorage.getItem("productArray"));
    productInfo[idx] = updatedData;
    localStorage.setItem("productArray", JSON.stringify(productInfo));
  }
  editIndex = null;
  location.reload();
}

//edit form
function openModal(index) {
  let productInfo = JSON.parse(localStorage.getItem("productArray"))[index];
  document.getElementById("modal_id").value = productInfo.id;
  document.getElementById("modal_pname").value = productInfo.name;
  editImage = productInfo.image;
  document.getElementById("modal_price").value = productInfo.price;
  document.getElementById("modal_pdesc").value = productInfo.description;
  editIndex = index;
}

function deleteData(index) {
  let confirmation = confirm(
    "Do you want to delete product : " + product[index].name
  );
  if (confirmation == true) {
    product.splice(index, 1);
    localStorage.setItem("productArray", JSON.stringify(product));
    location.reload();
  }
}

function sortProduct() {
  let sortingValue = document.getElementById("sorting").value;
  switch (sortingValue) {
    case "p_id":
      product.sort(byProductId);
      break;
    case "p_name":
      product.sort(byProductName);
      break;
    case "p_price":
      product.sort(byProductPrice);
  }
  localStorage.setItem("productArray", JSON.stringify(product));
  location.reload();
}

function byProductId(a, b) {
  return a.id - b.id;
}

function byProductName(a, b) {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  } else {
    return 0;
  }
}

function byProductPrice(a, b) {
  return a.price - b.price;
}

function filter() {
  let search = document.getElementById("search").value.toUpperCase();
  let productTable = document.getElementById("crudTable");
  let tr = productTable.getElementsByTagName("tr");

  for (var i = 0; i < tr.length; i++) {
    let tdID = tr[i].getElementsByTagName("td")[0];
    let tdName = tr[i].getElementsByTagName("td")[1];

    if (tdID || tdName) {
      let idVal = tdID.textContent || tdID.innerHTML;
      let nameVal = tdName.textContent || tdName.innerHTML;
      let idValExists = idVal.toUpperCase().indexOf(search);
      let nameValExists = nameVal.toUpperCase().indexOf(search);
      if (idValExists > -1 || nameValExists > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
