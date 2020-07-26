import "./styles.css";

const maybeShowRunButton = function() {
  let status1 = document.getElementById('status1').innerHTML;
  let status2 = document.getElementById('status2').innerHTML;

  console.log(`status1 is ${status1}.`);
  console.log(`status2 is ${status2}.`);

  if (status1 === 'true' && status2 === 'true') {
    document.getElementById('runButton').style.visibility = 'visible';
  }
}

let inventory = {};
let orders = {};

document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use the same configuration as Parcel to bundle this sandbox, you can find more
  info about Parcel
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
`;

document.getElementById('file1').addEventListener('change', function(evt) {
  // console.log(evt);
  openInventoryFile(evt, 'output1');
});

document.getElementById('file2').addEventListener('change', function(evt) {
  // console.log(evt);
  openRakutenExcelFile(evt, 'output2');
});

document.getElementById('runButton').addEventListener('click', function(evt) {
  // console.log(evt);
  console.log(typeof inventory);
  console.log(typeof orders);
  compareOrdersAndInventory(inventory, orders);
});

// Inventory class
const Inventory = function(itemNumber, warehouse, location, lot, quantity) {
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
const openInventoryFile = function(evt, outputArea) {
  let input = evt.target;

  let reader = new FileReader;
  reader.onload = function() {
    let text = reader.result;
    let output = document.getElementById(outputArea);
    // output.innerHTML = text;

    let parsed = Papa.parse(text);
    // console.log('parsed is... ');
    // console.log(parsed);
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

/*     for (const itemNumber in FXInventory) {
      tmpText += `<p>${itemNumber} ... ${FXInventory[itemNumber]}</p>`;
    }

    output.innerHTML = tmpText;
 */
    inventory = FXInventory;  // put inventory dict to global var inventory
    // console.log(inventory);
    document.getElementById('status1').innerHTML = 'true';
    maybeShowRunButton();

  };  // end reader.onload

  reader.onerror = function(err) {
    console.log(err);
  };

  reader.readAsText(input.files[0]);

};  // end openInventoryFile = function() {

// Rakuten Order Line class
const RakutenOrderLine = function(i) {
  this.itemNumber = i.B.toString();
  this.quantity = Number(i.E);

  this.repr = function() {
    return `${this.itemNumber} ... ${this.quantity}.`;
  }

};

// upload and process Rakuten Excel file
const openRakutenExcelFile = function(evt, outputArea) {
  let input = evt.target;

  let reader = new FileReader;
  reader.onload = function(e) {
    let data = e.target.result;
    let workbook = XLSX.read(data, {type: 'binary'});
    let XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets['提出用'], {header: "A"});
    // let rakutenOrders = [];
    let rakutenOrdersDict = {};
    // let tmpText = '';
    XL_row_object.forEach(function(i) {
      if (typeof i.B !== 'undefined' && i.B.toString() !== '商品ｺｰﾄﾞ' && i.B.toString() !== '総計') {
        let order = new RakutenOrderLine(i);
        // rakutenOrders.push(order);
        // tmpText += '<p>' + order.repr() + '</p>';
        if (order.itemNumber in rakutenOrdersDict === false) {
          rakutenOrdersDict[order.itemNumber] = 0;
        }
        rakutenOrdersDict[order.itemNumber] += order.quantity;
      }
    });

    // let output = document.getElementById(outputArea);
    // output.innerHTML = tmpText;

    orders = rakutenOrdersDict; // put order dict to global var orders
    // console.log(orders);
    document.getElementById('status2').innerHTML = 'true';
    maybeShowRunButton();

  }; // end reader.onload

  reader.onerror = function(err) {
    console.log(err);
  };

  reader.readAsBinaryString(input.files[0]);

} // end openRakutenExcelFile


// compare Orders and Inventory
const compareOrdersAndInventory = function(inventory, orders) {
  // take all keys
  let itemNumbers = Object.keys(inventory);
  for (const itemNumber in orders) {
  // orders.forEach(function(itemNumber) {
    if (itemNumber in itemNumbers === false) {
      itemNumbers.push(itemNumber);
    }
  }
  itemNumbers.sort();

  let comparison = {};
  let tmpText = document.getElementById('output4').innerHTML;

  itemNumbers.forEach(function(itemNumber) {
    if (itemNumber in comparison === false) {
      comparison[itemNumber] = {inv: 0, order: 0, diff: 0};
    }
    if (itemNumber in inventory) {
      comparison[itemNumber]['inv'] = inventory[itemNumber];
    }
    if (itemNumber in orders) {
      comparison[itemNumber]['order'] = orders[itemNumber];
    }
    comparison[itemNumber]['diff'] = comparison[itemNumber]['inv'] - comparison[itemNumber]['order'];

    tmpText += `<tr><td>${itemNumber}</td><td>${comparison[itemNumber]['inv']}</td><td>${comparison[itemNumber]['order']}</td><td>${comparison[itemNumber]['diff']}</td></tr>`
  });

  document.getElementById('output4').innerHTML = tmpText;

  document.getElementById('output4').style.visibility = 'visible';

}