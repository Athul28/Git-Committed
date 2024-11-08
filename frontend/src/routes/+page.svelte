<script>
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import { page } from '$app/stores';
    import Navbar from "../lib/components/Navbar/+page.svelte"
</script>

<style>
	.details{
		text-indent: 5px;
	}
	.signedInText{
  	font-size: 20px;
	}
	.notSignedInText{
  	font-size: 20px;
	}
	.buttonPrimary{
		text-align: center;
	}
</style>

<Navbar />
<nav class="border">
	<div class="details">
		{#if $page.data.session}
			{#if $page.data.session.user?.image}
				<img src={$page.data.session.user.image} class="avatar" alt="User Avatar"/>
			{/if}
			<p class="signedInText">
				<small>Signed in as</small><br />
				<strong>{$page.data.session.user?.name ?? 'User'}</strong>
			</p>
			<SignOut>
				<div slot="submitButton" class="buttonPrimary">Sign out</div>
			</SignOut>
		{:else}
			<span class="notSignedInText">You are not signed in</span>
			<SignIn>
				<div slot="submitButton" class="buttonPrimary">Sign in</div>
			</SignIn>
		{/if}
	</div>
</nav>