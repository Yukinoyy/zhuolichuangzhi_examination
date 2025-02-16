<template>
    <div class="jcr_partition">
        <span>{{ props.label }}</span>
        <el-dropdown trigger="click" :hide-on-click="false" @command="handleSelect" :style="{width: props.width + 'px'}">
            <span class="el-dropdown-link">
                <span :style="{ color: option == props.options[0] ? '' : '#fc6c38' }">{{ option }}</span>
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu> 
                    <el-dropdown-item v-for="(item, index) in props.options" :key="index" :command="item"
                        :class="{ 'is_selected': option == item }">{{ item }}</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue';

const emit = defineEmits(['select']);

const props = defineProps({
    default: String,
    label: String,
    options: Array,
    width: String
});

const option = ref(props.default);

const handleSelect = (command) => {
    if(option.value == command) return;
    option.value = command;
    emit('select', command);
}
</script>