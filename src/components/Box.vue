<template>
	<div class="box-container">
		<div class="box-header">
			<div class="box-icon-container">
				<div class="icon">{{ icon }}</div>
			</div>
			<div v-if="open" class="box-title-container">
				<div class="box-title">{{ title }}</div>
			</div>
		</div>
		<div class="box-content">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Box',
	props: ['open', 'title', 'icon']
}
</script>

<style lang="less">
.box-container {
	width: 290px;
	box-shadow: 0px 1px 10px #00000036;
	position: relative;
	border-radius: 10px;

	.box-header {
		display: grid;
		grid-template-columns: 40px 1fr;
		background: cyan;
		grid-template-rows: 40px 1fr;
		border-radius: 100px;
		top: -10px;
		position: absolute;
		width: 106%;
		left: -7px;
		box-shadow: 0 1px 10px #0000003d;

		.box-icon-container {
			position: relative;

			.icon {
				position: absolute;
				background: blue;
				width: 50px;
				height: 50px;
				border-radius: 50%;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				display: table-cell;
				line-height: 50px;
				font-size: 1.5em;
				box-shadow: 0 1px 10px #00000070;
			}
		}
		.box-title-container {
			text-align: center;
			vertical-align: middle;
			place-self: stretch;
			display: grid;
			padding-left: 25px;

			.box-title {
 				justify-self: start;
				text-align: left;
				align-self: center;
				font-size: 1.2em;
			}
		}
	}

	.box-content {
		padding: 38px 0 12px;
	}
}
</style>
