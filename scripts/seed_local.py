"""Seed only this project's local Docker DB; never targets a remote URL."""
from local_db import ROOT, sql


def seed(database='ourspace'):
    sql((ROOT / 'db/seeds/local_accounts.sql').read_text(encoding='utf-8'), database)


if __name__ == '__main__':
    seed()
    print('Two synthetic local account fixtures seeded; no auth credentials created.')
