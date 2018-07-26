(function() {
var proxy = 'proxy.php?url=';
//Your Alma's Api key
var key = '';
var alma = 'https://api-na.hosted.exlibrisgroup.com';

var today = new Date();
today =  ('0' + (today.getMonth()+1)).slice(-2) + '/'
   + ('0' + today.getDate()).slice(-2) + '/'
   + today.getFullYear();
     
var courses = Vue.component('courses-list', {
  data: function() {
    return {
      records: [],
      fields: [],
      orders: [],
      funds: [],
      code1: [],
      code2: [],
      code3: [],
      locations: [],
      loading:false,
      today: today,
    };
  },
  template: `
  <div :class="{loading:loading}">
    Import for <input v-model="today"/><br/>
    <input v-if="orders.length === 0" @change="importFile($event)" type="file"/>
    <div v-if="orders.length === 0 && fields.length > 0">No records found for {{today}}</div>
    <div v-if="orders.length > 0">Orders found with Order Date of: {{today}}</div>
    <div v-for="order in orders" class="card card-deck" style="padding:10px;margin:10px 0 ">
        <div class="form-group title"><label>Title<input required class="form-control" v-model="order.resource_metadata.title"/></label></div>
        <div class="form-group cost"><label>Cost<input required class="form-control" v-model="order.price.sum" disabled/></label></div>
        <div class="form-group fund"><label>Fund<select required class="form-control" v-model="order.fund_distribution[0].fund_code.value">
          <option v-for="fund in funds" :value="fund.code">{{fund.code}} | {{fund.name}}</option></select></label><button @click="setFund" v-if="orders[0] === order">Use Fund for All</button></div>
        <div class="form-group loc"><label>Location<select required class="form-control" v-model="order.location[0].shelving_location">
          <option v-for="loc in locations" :value="loc.code">{{loc.code}} | {{loc.name}}</option></select></label><button @click="setLocation" v-if="orders[0] === order">Use Location for All</button></div>
        <div class="form-group code1"><label>Reporting Code<select  class="form-control" v-model="order.reporting_code">
          <option v-for="code in code1" :value="code.code">{{code.code}} | {{code.description}}</option></select></label></div>
        <div class="form-group code2"><label>Secondary Reporting Code<select  class="form-control" v-model="order.secondary_reporting_code">
          <option v-for="code in code2" :value="code.code">{{code.code}} | {{code.description}}</option></select></label></div>
        <div class="form-group code3"><label>Tiertary Reporting Code<select  class="form-control" v-model="order.tiertiary_reporting_code">
          <option v-for="code in code3" :value="code.code">{{code.code}} | {{code.description}}</option></select></label></div>
        <div class="form-group mat"><label>Material Type<input required class="form-control" v-model="order.material_type.value"/></label></div>
        <div class="form-group note"><label>Notes<input required class="form-control" v-model="order.note[0].note_text"/></label></div>
    </div>
    <button type="button" @click="submitOrders" v-if="orders.length > 0">Send Orders to Alma</button>
  </div>`,
  created: function() {
    var ctrl = this;
    ctrl.funds = funds.fund;
    ctrl.code1 = code1.row;
    ctrl.code2 = code2.row;
    ctrl.code3 = code3.row;
    ctrl.locations = locations.location;
  },
  computed: {
    
  },
  methods: {
    submitOrders: function() {
      var ctrl = this;
      ctrl.loading = true;
      var count = 0;
      this.orders.forEach(function(order) {
      axios.post(proxy + encodeURIComponent(alma + '/almaws/v1/acq/po-lines?apikey='+key+'&format=json'), order)
        .then(function(response) {
          count++;
          if (count === ctrl.orders.length) {
            ctrl.loading = false;
            alert('Orders Submitted');
          }
          console.log(response.data);
        }).catch(function() {
          alert('Order failed');
          count++;
          if (count === ctrl.orders.length) {
            ctrl.loading = false;
          }
        });
      });
    },
    setFund: function() {
      var ctrl = this;
      var fund = ctrl.orders[0].fund_distribution[0].fund_code.value;
      ctrl.orders.forEach(function(order) {
        order.fund_distribution[0].fund_code.value = fund;
      });
    },
    setLocation: function() {
      var ctrl = this;
      var loc = ctrl.orders[0].location[0].shelving_location;
      ctrl.orders.forEach(function(order) {
        order.location[0].shelving_location = loc;
      });
    },
    importFile: function(e) {
      var ctrl = this;
      if (e.currentTarget.files.length === 0) {
        return false;
      }
      if (e.currentTarget.files[0].name.slice(-4) !== '.csv') {
        alert('Can only import CSV files');
        return false;
      }
      var reader = new FileReader();
      var today = ctrl.today;
      reader.onload = function(event) {
        var content = event.target.result;
        var records = Papa.parse(content, {header:true});
        ctrl.records = records.data;
        ctrl.fields = records.meta.fields
        ctrl.records.forEach(function(record) {
          if (record['Order Date'] === today) {
            var i = ctrl.makeOrder(record);
          }
        });
        console.log(ctrl);
      }
      reader.readAsText(e.target.files[0], 'UTF-8');
    },
    makeOrder: function(record) {
      if (!record['Order ID']) {
        return false;
      }
      //REPLACE with your Amazon Vendor CODE in Alma
      var vendor = 'amafa';
      var cost = record['Item Net Total'].replace('$', '');
      var order = {
        owner: {
          value: 'MAIN'
        },
        type: {
          value: 'PRINT_OT'
        },
        vendor: {
          value: vendor
        },
        rush: false,
        price: {
          sum: cost,
          currency: {
            value: 'USD'
          }
        },
        location: [{
          quantity:1,
          library: {
            value: 'MAIN',
            desc: 'Main Library'
          },
          shelving_location: 'stacks'
        }],
        vendor_reference_number: record['ASIN'].replace('="', '').replace('"', ''),
        //po_number: record['PO Number'],
        resource_metadata: {
          title: record.Title,
          author: '',
          issn: null,
          isbn: record['ASIN'].replace('="', '').replace('"', ''),
          publisher: '',
          publication_place: '',
          publication_year: ' ',
          vendor_title_number: ''
        },
        reporting_code: '',
        secondary_reporting_code: '',
        tertiary_reporting_code: '',
        material_type: {
          value: record['Product Category'].toUpperCase()
        },
        note: [{note_text:''},{note_text: 'PO Number: ' + record['PO Number']}],
        fund_distribution: [{
          fund_code: {
            value: '',
            desc: null
          },
          amount: {
            sum: cost,
            currency: {
              value: 'USD',
              desc: null
            }
          }
        }]
      };
      this.orders.push(order);
      return this.orders.length - 1;
    }
  }
});

var routes = [
  { path: '/', component: courses }
]

var router = new VueRouter({
  routes: routes
})

var app = new Vue({
  el: '#app',
  router: router,
  data: {
  
  }
});

}());
