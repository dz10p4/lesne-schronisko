<script setup>
   
</script>
<template>
    <button class="toggler" @click="toggleCatEdit()" v-if="displayState === 0">Edytuj kategorie</button>
    <button class="toggler" @click="toggleCatEdit()" v-else>Zamknij</button>
    <div class="edit-window-wrapper" v-if="displayState === 1">
        <div class="edit-window" v-if="displayState === 1">
            <div v-for="(cate,key) in categories" class="category-wrapper">
                <div class="listed-category">{{cate.category}}</div>
                <button @click="selectCategory(categories[key].category)" class="delButton" v-if="confirmationState === 0">Usuń</button>
            </div>
            <button @click="confirmRmCategory()" class="delButton" style="margin-top:20px;" v-if="confirmationState === 1">Kliknij tutaj aby potwierdzić usunięcie: {{selectedCategory}}</button>
            <p class="category-add-info">Dodaj kategorię:</p>
            <input type="text" class="category-add-input" @keyup.enter="addCategory()" v-model="categoryName" />
            <button class="add-button" v-if="categoryName !== ''" @click="addCategory()">Dodaj</button>
        </div>
    </div>
</template>
<script>
import PostService from '../PostService';
import CategoryService from '../CategoryService'

export default { 
    name: 'EditCategories',
    data() {
        return {
            categories: [],
            displayState: 0,
            error: '',
            categoryName: '',
            catChanges: 0,
            confirmationState: 0,
            selectedCategory: '',
        }
    },
    async created() {
        try {
            this.categories = await PostService.getPosts();
        } 
        catch(err) {
            this.error=err.message;
        }
    },
    methods:{ 
        toggleCatEdit:function() {
            if(this.displayState===0)this.displayState=1;
            else if(this.catChanges === 0){this.displayState=0; this.categoryName = '';}
            else window.location.reload();
        },

        async addCategory() {
            if(this.categoryName === '')return;
            await PostService.insertPost(this.categoryName);
            await CategoryService.insertPost(this.categoryName);
            this.categories = await PostService.getPosts();
            this.categoryName = '';
            this.catChanges++;
        },

        selectCategory:function(a) {
            this.selectedCategory = a;
            this.confirmationState = 1;
        },

        async confirmRmCategory() {
            await CategoryService.deletePost(this.selectedCategory);
            await CategoryService.deleteFields(this.selectedCategory);
            this.categories = await PostService.getPosts();
            this.catChanges++;
            this.confirmationState = 0;
        },
    },
}
</script>
<style scoped>
@import '@/assets/EditCategories.css';


</style>