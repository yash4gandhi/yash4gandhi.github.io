# Portfolio analytics

GA4 stream: `G-RHNLBZDB2H`. This measurement ID is public, not a secret.

The local `analytics.js` module appears on every page. Google's tag is loaded
only on `https://yash4gandhi.github.io` after a visitor allows analytics.
Declining, withdrawing consent, or Global Privacy Control disables collection.
No events or tag requests are sent by local previews, even after Allow.
Visitors can reopen preferences from the footer or the Privacy page.

Consent choices last up to 180 days in local storage. GA cookies are configured
for 90 days; Google signals and advertising consent remain disabled. Withdrawal
sets Google's ga-disable flag, updates consent and clears first-party GA
cookies. It does not delete historical data from the Analytics property.

## Events

| Event | Meaning | Useful parameters |
| --- | --- | --- |
| page_view | One permitted view per loaded page | page_location, page_title, project_id on project pages |
| project_open | Click to a project page | project_id, source_area |
| resume_click | Click to view or download the selected PDF | link_kind, source_area |
| contact_click | Click to open an email or phone application | contact_method, source_area |
| citation_click | Click to a public citation download | publication_id |
| external_link | Click to an external site | destination_domain, link_kind, source_area |
| demo_interaction | Click/change on an explicitly listed demo control | project_id, control, selection when applicable |
| carousel_interaction | Manual hero carousel control | control |

No automated carousel transitions are tracked. Range controls emit on change,
not every input frame. Animation toggle/replay/chapter clicks indicate use of
controls, not completed viewing or successful inference. Download/contact
clicks do not prove the file was saved or a message/call was completed.

Custom events omit full external URLs, query strings, fragments, email/phone
values and free-form text. Configured page URLs use the generated route, even
on a 404, and referrers are reduced to their origin. This intentionally omits
UTM query campaign attribution. Enhanced measurement, enabled in the GA
console, can separately emit its own click/file_download/video/scroll events;
do not sum those with custom events as if they were separate user actions.
Do not enable user-provided data collection or add advertising tags here.

## After publishing

1. Open the live website, then allow analytics. Localhost will never populate GA.
2. In GA4, open Reports → Realtime and verify a page_view arrives. Interact with
   a project, résumé link and demo, then check the relevant event names.
3. A browser extension may block Analytics; the website still works normally.
4. In Admin → Data display → Custom definitions, create event-scoped dimensions
   for project_id, control, selection, source_area, link_kind, contact_method,
   destination_domain and publication_id when those breakdowns are needed.
   Use those dimensions with Event name and Event count in an Exploration.
5. Optionally mark resume_click and contact_click as key events.

The warning in Web stream details can remain while Google processes the first
visits. Realtime is the initial check. Routine reports and custom dimensions
may take longer to populate. Analytics counts are estimates because consent
and content blockers limit collection.

## Verification

Run the normal build and tests. Tests execute the real tracking script with a
fake document, local storage and dataLayer; they never load Google's script.
Consent UI can be checked in local previews without sending production events.
Live ingestion can only be confirmed after publishing and receiving a permitted
visit. Clarity is not installed by this change.
