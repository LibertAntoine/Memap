<template>
	<div class="round-button-container">
		<div class="icon-container" :style="{ backgroundColor: color }"><i :class="icon" class="icon"></i></div>
	</div>
</template>

<script>
export default {
	name: 'RoundButton',
	props: [ 'icon', 'color' ]
}
</script>

<style lang="less">
.round-button-container {
	.icon-container {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		font-size: 10px;
		color: white;

		i {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
