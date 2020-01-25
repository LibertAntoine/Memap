<template>
	<div class="round-button-container">
		<div class="icon-container"><slot class="icon"></slot></div>
	</div>
</template>

<script>
export default {
	name: 'RoundButton',
	props: [ 'icon' ]
}
</script>

<style lang="less">
.round-button-container {
	.icon-container {
		width: 20px;
		height: 20px;
		background: grey;
		border-radius: 50%;
	}
}
</style>
