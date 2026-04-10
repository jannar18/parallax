# ASMV-84: Studio desk fallback: show recent artifacts when no fresh updates

Commit 9301757 added a hard 1-week filter to the homepage ArtifactBar (filter on artifacts where date >= oneWeekAgo). When the site hasn't been updated in a week, the desk renders ArtifactBar's empty state ('The desk is empty — check back soon.') which the user finds depressing.

Current uncommitted WIP removes the filter entirely and shows ALL artifacts. That's one valid option but loses the 'recent' framing.

Better behavior: show whatever the most recent week's worth of artifacts is, OR fall back to the most recent N artifacts regardless of age, so the desk is never empty when content exists. Decide on the rule with user. Update getAllNowEntries usage in src/app/page.tsx accordingly.
