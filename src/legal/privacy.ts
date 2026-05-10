export const PRIVACY_POLICY_VERSION = '1.0';
export const PRIVACY_POLICY_DATE = '2026-05-10';

export const PRIVACY_POLICY_SUMMARY =
  'Mylo collects only what is needed to deliver your child\'s home program. You can export or delete everything at any time.';

export interface PolicySection {
  title: string;
  body: string;
}

export const PRIVACY_POLICY: PolicySection[] = [
  {
    title: 'Who is responsible for your data',
    body:
      'Mylo, Inc. is the controller of your personal data under the EU General Data Protection Regulation (GDPR) and equivalent local laws. For privacy questions or to exercise your rights, contact privacy@mylo.example. (Replace with your real DPO contact.)',
  },
  {
    title: 'What we collect',
    body:
      'When you sign up: your email and password (managed by Firebase Authentication), your role (parent or SLP), and an optional display name. When you set up a child profile: the child\'s first name, primary language, and an optional date of birth. While you use the app: session logs containing the date, language used, target words attempted, whether each attempt was prompted or spontaneous, and an optional one-line highlight you write yourself.',
  },
  {
    title: 'What we do not collect',
    body:
      'We do not record audio or video of your child. We do not collect device contacts, location, or advertising identifiers. We do not sell your data and we do not share it with advertisers.',
  },
  {
    title: 'Why we process it (lawful bases)',
    body:
      'Performance of the service you signed up for (Art. 6(1)(b) GDPR) covers delivering courses, saving session logs, and showing your SLP your child\'s progress. Your explicit consent (Art. 6(1)(a) and Art. 9 where special categories apply) covers the processing of your child\'s data, optional analytics, and optional product-update emails. Because the data subject is a child, we additionally rely on parental consent (Art. 8 GDPR) which you give at sign-up.',
  },
  {
    title: 'Who sees it',
    body:
      'Your data lives in Google Cloud Firestore (Firebase) operated by Google as our processor. The SLP you choose to link to your child can read that child\'s logs. Nobody else has access. We may engage additional processors in future; if so we will update this policy.',
  },
  {
    title: 'Where it is stored',
    body:
      'We deploy our Firebase project in an EU region for users in the European Economic Area. If your account is registered outside the EEA, your data may be stored in another region we choose for performance.',
  },
  {
    title: 'How long we keep it',
    body:
      'We keep your data for as long as your account is active. When you delete your account from the app, we delete your user record, all child profiles you created, and all of your session logs immediately. Firebase backups are retained for up to 30 days and then purged.',
  },
  {
    title: 'Your rights',
    body:
      'You may at any time access your data, correct it, port it (export as JSON via "Download my data"), restrict or object to processing, withdraw consent, and delete your account ("Delete account & all data"). You can also lodge a complaint with your local data protection authority.',
  },
  {
    title: 'Children',
    body:
      'Mylo is designed to be operated by a parent, legal guardian, or licensed SLP — never directly by the child. We require explicit parental consent before any child data is processed. If you discover we hold data about a child without proper authorization, contact us and we will delete it.',
  },
  {
    title: 'Security',
    body:
      'Authentication, transport, and storage rely on Firebase\'s managed security. Firestore rules limit reads and writes to the owning user and any linked SLP. We will report any breach affecting your data to you and to the relevant authority within 72 hours where required.',
  },
  {
    title: 'Changes to this policy',
    body:
      `When we make material changes we increment the policy version (you are reading version ${PRIVACY_POLICY_VERSION}, dated ${PRIVACY_POLICY_DATE}) and ask you to re-confirm consent in the app. Earlier versions are kept on file.`,
  },
];
