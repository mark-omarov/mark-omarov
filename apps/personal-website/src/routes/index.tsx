import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import {
  Avatar,
  BeakerIcon,
  ContributionCard,
  FileBadgeIcon,
  GitHubIcon,
  IconButton,
  Link,
  MailIcon,
  OrganizationIcon,
  RepositoryIcon,
  Title,
} from "~/components";

export default component$(() => {
  return (
    <div class="pt-10 space-y-12">
      <div class="space-y-6">
        <div class="flex justify-center">
          <Avatar>
            <a
              href="mailto:reply.qml41@slmail.me"
              class="absolute rounded-full bottom-0 right-0 p-1.5"
            >
              <IconButton icon={MailIcon} />
            </a>
          </Avatar>
        </div>

        <div class="flex flex-col items-center space-y-2">
          <h1 class="text-text text-4xl font-bold uppercase">Mark Omarov</h1>
          <h2 class="text-text text-base flex">
            Founder&nbsp;
            <Link to="https://github.com/trunklabs" external class={{ a: "b" }}>
              @trunklabs
            </Link>
          </h2>
        </div>
      </div>

      <div class="space-y-4">
        <Title>
          <RepositoryIcon q:slot="icon" class="fill-text w-full h-full" />
          Open-Source Contributions
        </Title>
        <div class="space-y-2">
          <ContributionCard>
            <span q:slot="title" class="flex">
              Contributor at&nbsp;
              <Link to="https://github.com/pnpm/pnpm" external>
                pnpm/pnpm
              </Link>
            </span>
            Fast, disk space efficient package manager --
            快速的，节省磁盘空间的包管理工具
          </ContributionCard>
          <ContributionCard>
            <span q:slot="title">
              Member of&nbsp;
              <Link
                to="https://github.com/Travelport-Ukraine/uapi-json"
                external
              >
                Travelport-Ukraine/uapi-json
              </Link>
            </span>
            Best Travelport Universal API wrapper ever ✈️ 🚞 🏨
          </ContributionCard>
          <ContributionCard>
            <span q:slot="title">
              Member of&nbsp;
              <Link to="https://github.com/csdojo-defaang/defaang" external>
                csdojo-defaang/defaang
              </Link>
            </span>
            A website that will curate recently-asked interview questions from
            FAANG+ to help people practice & prep!
          </ContributionCard>
          <a
            href="https://github.com/mark-omarov"
            class="w-full bg-secondary rounded border border-border p-2
          flex justify-center items-center cursor-pointer hover:border-accent space-x-1 group"
          >
            <GitHubIcon class="fill-text group-hover:fill-accent h-6 w-6" />
            <span class="text-text text-lg font-bold group-hover:text-accent">
              See more on GitHub
            </span>
          </a>
        </div>
      </div>

      <div class="space-y-4">
        <Title>
          <FileBadgeIcon q:slot="icon" class="fill-text w-full h-full" />
          Holopin Badges
        </Title>
        <div class="rounded overflow-clip border border-border aspect-[3.146622735/1]">
          <a href="https://holopin.io/@omarov" target="_blank">
            <img
              class="pointer-events-none"
              src="https://holopin.me/omarov"
              alt="@omarov holopin badges board"
            />
          </a>
        </div>
      </div>

      <div class="space-y-12">
        <div class="space-y-4">
          <Title>
            <BeakerIcon q:slot="icon" class="fill-text w-full h-full" />
            Highlighted Experience
          </Title>
          <div class="space-y-2">
            <div class="flex justify-between space-x-2">
              <div class="w-full rounded border border-border px-1 py-1 text-text text-sm text-center">
                Tech Lead
              </div>
              <div class="w-full rounded border border-border px-1 py-1 text-text text-sm text-center">
                P2P Mentor
              </div>
              <div class="w-full rounded border border-border px-1 py-1 text-text text-sm text-center">
                Interviewer
              </div>
            </div>
            <div class="flex justify-between space-x-2">
              <div class="w-full rounded border border-border px-1 py-1 text-text text-sm text-center">
                Frontend Development
              </div>
              <div class="w-full rounded border border-border px-1 py-1 text-text text-sm text-center">
                Backend Development
              </div>
            </div>
            <div class="flex justify-between space-x-2">
              <div class="w-full rounded border border-border px-1 py-1 text-text text-sm text-center">
                Desktop Development
              </div>
              <div class="w-full rounded border border-border px-1 py-1 text-text text-sm text-center">
                DevOps-ish
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <Title>
            <OrganizationIcon q:slot="icon" class="fill-text w-full h-full" />
            Clients
          </Title>
          <div class="space-y-2">
            <div class="flex space-x-2">
              <div class="w-full rounded border border-border px-1 py-1 text-text text-sm text-center">
                Asurion GK
              </div>
              <div class="w-full rounded border border-border px-1 py-1 text-text text-sm text-center">
                SpaceBus
              </div>
            </div>
            <div class="flex space-x-2">
              <div class="w-full rounded border border-border px-2 py-1 text-text text-sm text-center">
                Travelport
              </div>
              <div class="w-full rounded border border-border px-2 py-1 text-text text-sm text-center">
                Tenso, Beenos
              </div>
            </div>
            <div class="w-full rounded border border-border px-2 py-1 text-text text-sm text-center">
              SkyJump Technology
            </div>
          </div>
          <a
            href="mailto:reply.qml41@slmail.me"
            class="w-full bg-secondary rounded border border-border p-2
          flex justify-center items-center cursor-pointer hover:border-accent space-x-1 group"
          >
            <MailIcon class="fill-text group-hover:fill-accent h-6 w-6" />
            <span class="text-text text-lg font-bold group-hover:text-accent">
              Contact Me
            </span>
          </a>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Mark Omarov",
  meta: [
    {
      name: "description",
      content: "Personal website of Mark Omarov, founder of Trunklabs",
    },
  ],
};
