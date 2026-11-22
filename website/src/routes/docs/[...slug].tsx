import { useParams } from '@solidjs/router';
import { type JSX } from '@solidjs/web';
import { GuidePage } from '../../components/guide-page';

/** Render the maintained Markdown guide that the address names. */
export default function GuideRoute(): JSX.Element {
  const params = useParams<{ slug: string }>();
  return <GuidePage path={`/docs/${params.slug}`} />;
}
