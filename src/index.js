import "./styles.css";

document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use the same configuration as Parcel to bundle this sandbox, you can find more
  info about Parcel
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
`;

document.getElementById('file1').addEventListener('change', function(evt) {
  console.log(evt);
  openInventoryFile(evt, 'output1');
});

document.getElementById('file2').addEventListener('change', function(evt) {
  console.log(evt);
  openRakutenExcelFile(evt, 'output2');
});

// Inventory class
let Inventory = function(itemNumber, warehouse, location, lot, quantity) {
  this.itemNumber = itemNumber;
  this.warehouse = warehouse;
  this.location = location;
  this.lot = lot;
  this.quantity = Number(quantity);

  this.repr = function() {
    return `${this.itemNumber} ... ${this.quantity} at ${this.warehouse}/${this.location}.`;
  };

};

// Upload and process inventory file
let openInventoryFile = function(evt, outputArea) {
  let input = evt.target;

  let reader = new FileReader;
  reader.onload = function() {
    let text = reader.result;
    let output = document.getElementById(outputArea);
    // output.innerHTML = text;

    let parsed = Papa.parse(text);
    console.log('parsed is... ');
    console.log(parsed);
    let arrInventory = [];
    let tmpText = '';
    parsed.data.forEach(function(record, index) {

      let inventory = new Inventory(
        record[0],
        record[1],
        record[2],
        record[4],
        record[3],
      );

      arrInventory.push(inventory);
      // tmpText += '<p>' + inventory.repr() + '</p>';

    });

    let FXInventory = {};

    arrInventory.forEach(function(record, index) {
      if (record.warehouse === 'FX') {
        if (record.itemNumber in FXInventory === false) {
          FXInventory[record.itemNumber] = 0;
        }
        FXInventory[record.itemNumber] += record.quantity;
      }
    });

    for (const itemNumber in FXInventory) {
      tmpText += `<p>${itemNumber} ... ${FXInventory[itemNumber]}</p>`;
    }

    output.innerHTML = tmpText;
  };

  reader.readAsText(input.files[0]);
};

// Rakuten Order Line class
let RakutenOrderLine = function(i) {
  this.itemNumber = i.B.toString();
  this.quantity = Number(i.E);

  this.repr = function() {
    return `${this.itemNumber} ... ${this.quantity}.`;
  }

};

// upload and process Rakuten Excel file
let openRakutenExcelFile = function(evt, outputArea) {
  let input = evt.target;

  let reader = new FileReader;
  reader.onload = function(e) {
    let data = e.target.result;
    let workbook = XLSX.read(data, {type: 'binary'});
    let XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets['提出用'], {header: "A"});
    let rakutenOrders = [];
    let tmpText = '';
    XL_row_object.forEach(function(i) {
      if (typeof i.B !== 'undefined' && i.B.toString() !== '商品ｺｰﾄﾞ' && i.B.toString() !== '総計') {
        let order = new RakutenOrderLine(i);
        rakutenOrders.push(order);
        tmpText += '<p>' + order.repr() + '</p>';
      }
    });

    let output = document.getElementById(outputArea);
    output.innerHTML = tmpText;
  }; // end reader.onload

  reader.onerror = function(err) {
    console.log(err);
  };

  reader.readAsBinaryString(input.files[0]);

} // end openRakutenExcelFile