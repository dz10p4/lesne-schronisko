<script setup>
import { reactive } from 'vue';
import EditCartegories from './EditCartegories.vue';
import currencies from '../assets/currencies.json' 

defineProps({
  msg: {
    type: String,
    required: false
  }
})

</script>

<template>

<EditCartegories />


<div class="filter-wrapper">
  <input type="text" class="search-bar" placeholder="Wyszukaj..." v-model="searchValue" spellcheck="false" @keyup.enter="filterData()" />
  <button class="filter-button" @click="filterData()">Filtruj</button>
</div>

<p style="text-align:center; font-size: 20px; margin-top: 60px;">Waluta:</p>
<div class="currency-selector" @change="updateCurrency()">
  <select class="currency-select" v-model="currentCurrency">
    <option v-for="(cur, key) in currencies" v-bind:value="key">{{cur}}</option>
  </select>
</div>

<p style="text-align:center; font-size:18px; margin-top: 30px;" v-if="currentCurrency !== 'zł'">Kurs: 1 PLN = {{currencyMultiplier+' '+currentCurrency}} </p>


<div class="table-wrapper">
  <div class="frow" :style="{ gridTemplateColumns: 'repeat( calc(  '+posts.length+' + 4 ), 220px)'}">
    <div class="categ" style="cursor: pointer" @click="updateCategory('Miejsce')">

      <div v-if=" 'Miejsce' === pickedCategory.watchedCategory" class="grided">
        <p class="category-name">Miejsce</p> 
        <img src="../assets/line-angle-down.svg" class="arrow" type="image/svg+xml" v-if="pickedCategory.sortDirection === 1" />
        <img src="../assets/line-angle-up.svg" class="arrow" type="image/svg+xml" v-else />
      </div>

      <div v-else>
        <p class="category-name">Miejsce</p> 
      </div>
    </div>

    <div class="categ" style="cursor: pointer" @click="updateCategory('Mieszkaniec')">

      <div v-if=" 'Mieszkaniec' === pickedCategory.watchedCategory" class="grided">
        <p class="category-name">Mieszkaniec</p> 
        <img src="../assets/line-angle-down.svg" class="arrow" type="image/svg+xml" v-if="pickedCategory.sortDirection === 1" />
        <img src="../assets/line-angle-up.svg" class="arrow" type="image/svg+xml" v-else />
      </div>

      <div v-else>
        <p class="category-name">Mieszkaniec</p> 
      </div>
    </div>

    <div class="categ"
      v-for="(post) in posts"
      style="cursor: pointer"
      @click="updateCategory(post.category)"
    >
      <div v-if="post.category === pickedCategory.watchedCategory" class="grided">
        <p class="category-name">{{post.category}}</p> 
        <img src="../assets/line-angle-down.svg" class="arrow" type="image/svg+xml" v-if="pickedCategory.sortDirection === 1" />
        <img src="../assets/line-angle-up.svg" class="arrow" type="image/svg+xml" v-else />
      </div>
      <div v-else>
        <p class="category-name">{{post.category}}</p> 
      </div>
    </div>

    <div class="categ" style="cursor: pointer" @click="updateCategory('Cena')">

      <div v-if=" 'Cena' === pickedCategory.watchedCategory" class="grided">
        <p class="category-name">Cena</p> 
        <img src="../assets/line-angle-down.svg" class="arrow" type="image/svg+xml" v-if="pickedCategory.sortDirection === 1" />
        <img src="../assets/line-angle-up.svg" class="arrow" type="image/svg+xml" v-else />
      </div>

      <div v-else>
        <p class="category-name">Cena</p> 
      </div>
    </div>
    <div class="categ"><p class="category-name">Edycja</p></div>
  </div>

  <div class="srow" :style="{ gridTemplateColumns: 'repeat( calc(  '+posts.length+' + 4 ), 220px)'}">
    <div class="detail">
      <select v-model="dataToAdd['Miejsce']">
        <option value="Na drzewie">Na drzewie</option>
        <option value="Na ziemi">Na ziemi</option>
      </select>
    </div>
    <div class="detail"><input type="text" placeholder="Mieszkaniec" v-model="dataToAdd['Mieszkaniec']" @keyup.enter="sendAddedData()" /></div>

    <div class="detail" v-for="(post) in posts">
      <input type="text" :placeholder="post.category" v-model="dataToAdd[post.category]" @keyup.enter="sendAddedData()" />
    </div>

    <div class="detail" style="display: grid; grid-template-columns: 80% 20%"><input type="text" placeholder="Cena" v-model="dataToAdd['Cena']" @keyup.enter="sendAddedData()" class="price-input" /> <div class="pln">zł</div></div>
    <div class="detail"><img src="../assets/add-plus.svg" class="editic" @click="sendAddedData()" type="image/svg+xml"  /></div>
  </div>

  <div class="nrow"
    v-for="(house, key) in sortedHouses"
    :style="{ gridTemplateColumns: 'repeat( calc(  '+posts.length+' + 4 ), 220px)'}"
  >
    <div class="detail" v-if="key !== editedRowKey">{{house.Miejsce}}</div>
    <select v-model="editedData['Miejsce']" v-else>
      <option value="Na drzewie">Na drzewie</option>
      <option value="Na ziemi">Na ziemi</option>
    </select>

    <div class="detail" v-if="key !== editedRowKey">{{house.Mieszkaniec}}</div>
    <input type="text" v-model="editedData['Mieszkaniec']" v-else @keyup.enter="sendEditedData()" />

    <div class="detail" v-if="key !== editedRowKey" v-for="(post) in posts">{{ house[post.category] }}</div>
    <input type="text" v-else v-for="(post) in posts"  v-model="editedData[post.category]" @keyup.enter="sendEditedData()" />
   
    <div class="detail" v-if="key !== editedRowKey">{{currencyMultiplier < 0.01 ? (house.Cena * currencyMultiplier).toFixed(7) : (house.Cena * currencyMultiplier).toFixed(2) }} {{currentCurrency}}</div>
    <div class="detail" v-else> <input type="text"  v-model="editedData['Cena']" style="margin-right: 10px;" @keyup.enter="sendEditedData()" />  <div class="currency">zł</div> </div>

    <div class="detail">
      <EditIcon class="editic" @click="editValues(house._id,key)" v-if="key !== editedRowKey" />
      <div class="symbols-wrapper" v-else> 
         <img src="../assets/tick-symbol.svg" class="editic" @click="sendEditedData()" type="image/svg+xml" style="grid-column: 1; margin-right: 0;" />
         <img src="../assets/minus-round.svg" class="editic" @click="removeElement(key); reloadWindow();" type="image/svg+xml" style="grid-column: 2;" />
         <img src="../assets/cross-symbol.svg" class="editic" @click="reloadWindow()" type="image/svg+xml" style="grid-column: 3; margin-left: 0; " />
      </div>
    </div>
  </div>


</div>
</template>

<script>
import PostService from '../PostService';
import HouseService from '../HouseService'
import EditIcon from '../assets/edit-round-line.vue'
import CurrencyService from '../CurrencyService';
import { ref } from 'vue'

const pickedCategory = reactive({watchedCategory: 'Miejsce', sortDirection: 0});

const searchValue=ref('');
const currencyMultiplier=ref(1);

export default {
  name: 'Schematic',
  data() {
    return {
      posts: [],
      error: '',
      text: '',
      houses: [],
      editedRowKey: -1,
      currentCurrency: 'zł',
      editedData: [],
      searchQuery: '',
      dataToAdd: new Object(),
    }
  },
  async created() {

    try {
      this.posts = await PostService.getPosts()
      this.houses = await HouseService.getPosts()
      
    } catch(err) {
      this.error=err.message;
    }
    this.dataToAdd['Miejsce'] = 'Na drzewie';

  },
  methods: {
    updateCategory:function(param) {
      if(this.editedRowKey !== -1)return;
      if(pickedCategory.watchedCategory === param) { 
        if(pickedCategory.sortDirection === 1){ pickedCategory.sortDirection = 0; pickedCategory.sortDirection = 0;}
        else {pickedCategory.sortDirection = 1; pickedCategory.sortDirection=1;}
      }
      else {pickedCategory.sortDirection = 0; pickedCategory.sortDirection = 0;}
      pickedCategory.watchedCategory=param; pickedCategory.watchedCategory=param;
    },

    reloadWindow:function() {
      window.location.reload();
    },

    editValues:function(id,key) {
      this.editedRowKey = key;
      this.editedData = this.sortedHouses[key];
    },

    async sendEditedData() {
      var editedTable = this.editedData;
      editedTable['Cena'] = parseFloat(editedTable['Cena']);
      await HouseService.updateData(editedTable);

      this.editedData = [];
      this.editedRowKey = -1;
    },
    
    async sendAddedData() {
      var addData = this.dataToAdd;
      addData['Cena'] = parseFloat(addData['Cena']);
      await HouseService.addData(addData);
      this.dataToAdd = [];
      this.dataToAdd['Miejsce'] = 'Na drzewie';
      this.houses = await HouseService.getPosts();
    },

    async removeElement(key) {
      var delVal = this.sortedHouses[key]._id;
      await HouseService.deletePost(delVal);
      
    },

    filterData:function() {
      this.editedRowKey = -1;
      this.searchQuery = this.searchValue;
    },

    async updateCurrency() {
      if(this.currentCurrency === 'zł') this.currencyMultiplier = 1;
      else {
        
        var foreignCurrency;

        if(this.currentCurrency === '$')foreignCurrency = 'USD';
        else if(this.currentCurrency === '€')foreignCurrency = 'EUR';
        else foreignCurrency = this.currentCurrency;
        var currencyMultiplierbd = await CurrencyService.getMultiplier(foreignCurrency);
       
        this.currencyMultiplier =  currencyMultiplierbd.data.multiplier;
        
      }

    }



  },
  computed: {
    sortedHouses:function() {
      var filteredKeys = [];
      if(this.editedRowKey !== -1) return this.houses;

      if(this.searchQuery !== '')
      {
        return this.houses.sort((a,b) => {
          let comparator = 1;
          if(pickedCategory.sortDirection === 1) comparator = -1;
          if(typeof a[pickedCategory.watchedCategory] === 'string')return a[pickedCategory.watchedCategory].localeCompare(b[pickedCategory.watchedCategory])*comparator;
          else {
            if(a[pickedCategory.watchedCategory] < b[pickedCategory.watchedCategory])return -comparator;
            if(a[pickedCategory.watchedCategory] > b[pickedCategory.watchedCategory])return comparator;
          }
          return 0;
        }).filter((row,index) => {
          var checkedObject = new Object();
          checkedObject = row;
          delete checkedObject._id;
          delete checkedObject.id;
          var isIncluded = false;
          Object.values(checkedObject).forEach(item => {
            if(typeof item === "string") {
              
              if(item.toLowerCase().includes(this.searchQuery.toLowerCase())) {
                isIncluded = true;
              }
            }
            else {
              if(item.toString().includes(this.searchQuery.toLowerCase())) {
                isIncluded = true;
              }

            }
          })
          return isIncluded;
         });

      }

      return this.houses.sort((a,b) => {
        let comparator = 1;
        if(pickedCategory.sortDirection === 1) comparator = -1;
        if(typeof a[pickedCategory.watchedCategory] === 'string')return a[pickedCategory.watchedCategory].localeCompare(b[pickedCategory.watchedCategory])*comparator;
        else {
          if(a[pickedCategory.watchedCategory] < b[pickedCategory.watchedCategory])return -1*comparator;
          if(a[pickedCategory.watchedCategory] > b[pickedCategory.watchedCategory])return 1*comparator;
        }
        return 0;
      })
    }

  }

}




</script>


<style scoped>
@import '@/assets/Schematic.css';


</style>
