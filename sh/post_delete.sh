url="http://localhost:8080"
host="host:github-webhook.xxxxx.xxx"
contentType="content-type:application/json"
userAgent="user-agent:GitHub-Hookshot/43e4729"
xGitHubDelivery="x-gitHub-delivery:55ca2680-4c22-11e7-8fc9-aa6dfcfea24b"
xGitHubEvent="x-github-event:delete"
xHubSignature="x-hub-signature:sha1=838f2971f87b09bf3e3669851bac146567ce414e"
cat sh/post_delete_payload.json | curl $url -H $host -H $contentType -H $userAgent -H $xGitHubDelivery -H $xGitHubEvent -H $xHubSignature -d @-
