<template lang="html">
  <VResponsive>
    <VContainer>
      <VRow
        align="start"
        justify="center"
      >
        <VCol
          class="mt-12"
          cols="12"
          sm="10"
        >
          <h3 class="display-2 font-weight-medium">
            Spotify track preview
          </h3>
          <div class="mt-2 subtitle-1">
            Player to play the Spotify song preview
          </div>

          <VDivider class="my-3" />
          <h6 class="title mb-3">
            Press Login to Continue
          </h6>

          <VBtn
            color="primary"
            large
            :loading="loginLoading"
            @click="startAuthenticationProcess"
          >
            Login
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VResponsive>
</template>

<script>
import _ from 'lodash';
import AppInfo from '../app-info';

export default {
  name: 'Authenticate',
  data: () => ({
    loginLoading: false,
    gradient: 'to top right, rgba(63,81,181, .7), rgba(25,32,72, .7)'
  }),
  mounted () {
    if (_.get(this.$route, 'params.authenticateNow')) {
      this.startAuthenticationProcess();
    }

    const redirectedFrom = _.get(this.$route, 'redirectedFrom');
    if (redirectedFrom && _.startsWith(redirectedFrom, '/')) {
      this.loginLoading = true;
      const params = _.flow( // input: /foo=bar&bar=foo
        v => v.substring(1), // Remove the first '/': foo=bar&bar=foo
        v => _.split(v, '&'), // Split the query string in it's segments; ['foo=bar', 'bar=foo']
        v => _.map(v, segment => _.split(segment, '=')), // Split to components at the '='; [['foo', 'bar'], ['bar', 'foo']]
        v => _.map(v, components => _.map(components, component => decodeURIComponent(component))), // decodeURIComponent for all strings
        _.fromPairs // Create an object
      )(redirectedFrom);

      if ([
        'access_token',
        'expires_in',
        'state',
        'token_type'
      ].every(k => k in params) && _.get(params, 'expires_in', 0) > 0) {
        console.log('Got access token successfully');
        this.$localStorage.set('access_token', _.get(params, 'access_token'));
        this.$router.push({ name: 'Player' });
      } else {
        console.warn('The redirectedFrom key did not meet the required criteria', params);
      }
      this.loginLoading = false;
    }
  },
  methods: {
    startAuthenticationProcess () {
      const base = 'https://accounts.spotify.com/authorize';
      const params = {
        'response_type': 'token',
        'client_id': AppInfo.spotify.clientId,
        'redirect_uri': window.location.origin + window.location.pathname, // The URI to redirect to after the user grants/denies permission.
        'state': '',
        'scope': [
          'user-top-read'
        ]
      };
      const query = Object.keys(params)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&');

      console.log(`params`, params);
      console.log(`URL: ${base}?${query}`);

      window.location.assign(`${base}?${query}`);
    }
  }
};
</script>

<style lang="css">
</style>
