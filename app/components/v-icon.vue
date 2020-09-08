<template>
    <svg :class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path :d="path" />
    </svg>
</template>

<script>
export default {
    name: 'v-icon',

    data: () => ({
        path: '',
    }),

    methods: {
        updatePath() {
            if (!this.$scopedSlots) return
            if (typeof this.$scopedSlots.default !== 'function') return

            this.path = this.$scopedSlots
                .default()
                .map((n) => n.text)
                .join('')
        },
    },

    mounted() {
        this.updatePath()
    },

    updated() {
        this.updatePath()
    },
}
</script>

<style scoped>
.icon {
    display: block;
    color: inherit;
    fill: currentColor;
    width: 24px;
    height: 24px;
}
</style>