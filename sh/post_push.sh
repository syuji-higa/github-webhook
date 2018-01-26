url="http://localhost:8080"
host="host:github-webhook.xxxxx.xxx"
contentType="content-type:application/json"
userAgent="user-agent:GitHub-Hookshot/43e4729"
xGitHubDelivery="x-gitHub-delivery:9160f280-4c1a-11e7-9a5c-665afd5dbbda"
xGitHubEvent="x-github-event:push"
xHubSignature="x-hub-signature:sha1=fe689fada7ee99a8530a344a0a0fe79180e3233b"
cat sh/post_push_payload.json | curl $url -H $host -H $contentType -H $userAgent -H $xGitHubDelivery -H $xGitHubEvent -H $xHubSignature -d @-
