<template>
	<div class="test-container">
		<BoxSelection />
		<BoxSelection />
		<BoxSelection />
	</div>
</template>

<script>
import BoxSelection from '../components/BoxSelection'
export default {
	name: 'TestPage',
	components: {
		BoxSelection
	}
}
</script>

<style lang="less">
.test-container {
	display: grid;
	grid-template-columns: 1fr;
	margin-left: 70px;
	width: 70vw;
}
</style>
