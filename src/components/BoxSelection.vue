<template>
	<div class="box-selection-container">
		<Box :open="open" :title="title" :icon="icon">
			<div>test content</div>
			<div>test content</div>
			<div>test content</div>
		</Box>
	</div>
</template>

<script>
import Box from './Box'

export default {
	name: 'BoxSelection',
	data() {
		return {
			open: true,
			title: "Selection",
			icon: "👽"
		}
	},
	components: {
		Box
	}
}
</script>

<style lang="less">
.box-selection-container {
	margin: 20px;
}
</style>
