<script setup>
import Schematic from '@/components/Schematic.vue'

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
