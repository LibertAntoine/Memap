<template>
	<div class="tag-container">
		<div class="tag">
			<div class="tag-name">{{ name }}</div>
			<button @click="$emit('remove-tag')" class="circular ui icon button">
				  <i class="icon times"></i>
			</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Tag',
	props: ['name']
}
</script>

<style lang="less">
.tag-container {
	display: inline-flex;
	flex-wrap: wrap;
	margin: 0 5px;

	.tag{
		display: grid;
		grid-template-columns: auto 20px;
		background: lightgrey;
		border-radius: 50px;
		box-shadow: 0 1px 5px #3333334b;
		padding: 1px;

		.tag-name {
			padding: 0 5px 0 7px;
		}

		/* Overriding Semantic UI */
		.ui.button {
			font-size: 12px;
			padding: 0;
			background: none;
		}
	}
}
</style>
