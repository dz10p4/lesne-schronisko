<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Schematic from '@/components/Schematic.vue'
import axios from 'axios'
import PostService from './PostService.js'

defineProps({
  msg: {
    type: String,
    required: false
  }
});


</script>

<template>

  <Schematic />
  
</template>

<style>
@import '@/assets/base.css';


</style>
