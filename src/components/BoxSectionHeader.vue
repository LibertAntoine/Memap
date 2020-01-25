<template>
	<div class="box-section-title-container">
		<div>
			<h2 class="box-section-title">{{ title }}</h2>
			<slot></slot>
		</div>
		<hr>
	</div>
</template>

<script>
export default {
	name: 'BoxSectionHeader',
	props: ['title']
}
</script>

<style lang="less">
.box-section-title-container {
	display: grid;
	justify-content: stretch;

	> div {
		display: flex;
		flex-flow: row;
		width: 90%;
		justify-content: space-between;
		justify-self: center;

		/* button */
		> div {
			align-self: center;
		}

		.box-section-title {
			font-size: 1em;
			margin: 0;
		}
		.box-section-title-button {
			align-self: center;
		}
	}

	/* TODO: Make width smaller */
	hr {
		width: 90%;
		border: none;
		height: 1px;
		background: #111;
	}
}
</style>
