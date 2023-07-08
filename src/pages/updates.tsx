import { toast } from 'react-hot-toast';
import { useState, type ReactElement, type ReactNode, useEffect } from 'react';
import { useModal } from '@lib/hooks/useModal';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { MainContainer } from '@components/home/main-container';
import { Modal } from '@components/modal/modal';
import { ActionModal } from '@components/modal/action-modal';
import { StatsEmpty } from '@components/transmit/stats-empty';
import { Button } from '@components/ui/button';
import { ToolTip } from '@components/ui/tooltip';
import { HeroIcon } from '@components/ui/hero-icon';

type Release = {
  html_url: string;
  name: string;
  body: string;
  published_at: string;
};

export default function Updates(): JSX.Element {
  const { open, openModal, closeModal } = useModal();
  const [releases, setReleases] = useState<Release[]>([]);

  useEffect(() => {
    void fetch('https://api.github.com/repos/MostlyWhat/endeavour/releases')
      .then((response) => response.json())
      .then((data: Release[]) => setReleases(data));
  }, []);

  const handleReport = (): void => {
    // Open Github Issues Page
    const url = 'https://endeavour.mostlywhat.com/report';
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.focus();
      closeModal();
      toast.success('Successfully Redirected to Report Page.');
    } else toast.error('Failed to open report page.');
  };

  // Following is the updates section with the fetched releases
  return (
    <MainContainer>
      <SEO title='Updates / Endeavour' />
      <Modal
        modalClassName='max-w-xs bg-main-background w-full p-8 rounded-2xl'
        open={open}
        closeModal={closeModal}
      >
        <ActionModal
          title='Report Issues?'
          description='This will take you to the Report page. Are you sure you want to continue?'
          mainBtnClassName='bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75 accent-tab 
                            focus-visible:bg-accent-red/90'
          mainBtnLabel='Report'
          action={handleReport}
          closeModal={closeModal}
        />
      </Modal>
      <MainHeader className='flex items-center justify-between'>
        <div className='-mb-1 flex flex-col'>
          <h2 className='-mt-1 text-xl font-bold'>Updates</h2>
        </div>
        <Button
          className='dark-bg-tab group relative p-2 hover:bg-light-primary/10
                     active:bg-light-primary/20 dark:hover:bg-dark-primary/10 
                     dark:active:bg-dark-primary/20'
          onClick={openModal}
        >
          <HeroIcon className='h-5 w-5' iconName='MegaphoneIcon' />
          <ToolTip
            className='!-translate-x-20 translate-y-3 md:-translate-x-1/2'
            tip='Report Issues'
          />
        </Button>
      </MainHeader>
      <section className='mt-0.5'>
        <div className='flex flex-col'>
          {releases.map((release, index) => (
            <a
              href={release.html_url}
              key={index}
              target='_blank'
              rel='noopener noreferrer'
              className='group flex flex-col space-y-2 border-y border-light-border p-4 hover:bg-gray-100 dark:border-dark-border dark:hover:bg-gray-700'
            >
              <div className='flex flex-col space-y-1'>
                <h3 className='text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                  {release.name}
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {release.body}
                </p>
              </div>
              <div className='flex justify-between'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {new Date(release.published_at).toLocaleDateString()}
                </p>
              </div>
            </a>
          ))}
        </div>
        {releases.length === 0 && (
          <StatsEmpty
            title='There are no updates yet.'
            description='When there are updates to Endeavour, you’ll see them here.'
            imageData={{ src: '/assets/no-bookmarks.png', alt: 'No Updates' }}
          />
        )}
      </section>
    </MainContainer>
  );
}

Updates.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);
