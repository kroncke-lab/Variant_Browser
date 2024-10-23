from django.db import models

# Create your models here.
class newVariant(models.Model):
    class Meta:
        managed = False
        app_label = 'azure_data'
        db_table = 'all_vars_annotated'

    lqt2 = models.IntegerField(blank=True, null=False, default=0)
    var = models.TextField(blank=True, null=True)
    unaff = models.IntegerField(blank=True, null=False, default=0)
    ref = models.TextField(blank=True, null=True)
    alt = models.TextField(blank=True, null=True)
    wtAA = models.TextField(blank=True, null=True)
    mutAA = models.TextField(blank=True, null=True)
    isoform = models.TextField(blank=True, null=True)

    hgvsc = models.TextField(primary_key=True, db_column='HGVSc')
    hgvsp = models.TextField(db_column='HGVSp', blank=True, null=True)

    pos = models.IntegerField(blank=True, null=True)
    total_carriers = models.IntegerField(db_column='total_carriers_adj', blank=True, null=False, default=0)
    pph2_prob = models.TextField(blank=True, null=True)
    provean_score = models.TextField(blank=True, null=True)
    blast_pssm = models.TextField(blank=True, null=True)
    revel_score = models.TextField(blank=True, null=True)
    lqt2_dist = models.TextField(blank=True, null=True)
    chrom = models.IntegerField(blank=True, null=True)
    dnanum = models.IntegerField(blank=True, null=True)
    resnum = models.IntegerField(blank=True, null=True)
    alpha = models.TextField(db_column='alpha_revised', blank=True, null=True)
    beta = models.TextField(db_column='beta_revised', blank=True, null=True)

    gnomad = models.IntegerField(db_column='gnomad_v4', blank=False, null=False, default=0)  # Field name made lowercase.
    structure = models.TextField(db_column='Structure', blank=True, null=True)  # Field name made lowercase.
    function = models.TextField(db_column='Function', blank=True, null=True)  # Field name made lowercase.
    p_mean_w = models.IntegerField(db_column='LQT2_penetrance_revised', blank=True, null=True)

    @property
    def tot_carriers(self):
        return self.lqt2 * self.unaff

    def __str__(self):
        return self.var



class ClinicalPapers(models.Model):
    class Meta:
        managed = False
        app_label = 'azure_data'
        db_table = 'KCNH2_clinical'

    variant = models.TextField(db_column="Variant", blank=False, null=False)
    clinical_papers_id = models.IntegerField(primary_key=True, auto_created=True)
    lqt = models.IntegerField(db_column="LQT", default=0, blank=True, null=True)
    year = models.TextField(db_column="Year", blank=True, null=True)
    pmid = models.TextField(db_column="PMID", blank=True, null=True)
    scd = models.TextField(db_column="SCD", blank=True, null=True)
    amb = models.IntegerField(db_column="AMB", default=0, blank=True, null=True)
    una = models.IntegerField(db_column="UNA", default=0, blank=True, null=True)
    unaffected = models.IntegerField(db_column='AMB+UNA', blank=False, null=False, default=0)
    car = models.IntegerField(db_column="CAR", default=0, blank=True, null=True)
    unk = models.IntegerField(db_column="UNK", default=0, blank=True, null=True)
    other_diag = models.TextField(db_column='Other DIAG', blank=True, null=True)

    def __str__(self):
        return self.variant


class FunctionalPapers(models.Model):
    class Meta:
        managed = False
        app_label = 'azure_data'
        db_table = 'KCNH2_function'

    variant = models.TextField(db_column="Variant", blank=False, null=False)
    pmid = models.TextField(db_column="PMID", blank=True, null=True)

    kcnh2_function_id = models.IntegerField(primary_key=True)
    hm_peak_tail = models.FloatField()
    hm_ss = models.FloatField()
    hm_act = models.FloatField(blank=True, null=True)
    hm_inact = models.FloatField(blank=True, null=True)
    hm_inact_k = models.FloatField(blank=True, null=True)
    hm_tau_act = models.FloatField(blank=True, null=True)
    hm_recov_inact = models.FloatField(blank=True, null=True)
    hm_tau_deact_fast = models.FloatField(blank=True, null=True)
    ht_peak_tail = models.FloatField(blank=True, null=True)
    ht_ss = models.FloatField(blank=True, null=True)
    ht_act = models.FloatField(blank=True, null=True)
    ht_inact = models.FloatField(blank=True, null=True)
    ht_deact = models.FloatField(blank=True, null=True)
    cell_type = models.TextField(db_column='Cell type', blank=True, null=True)

    def __str__(self):
        return self.variant


class kcnh2Distances(models.Model):
    class Meta:
        managed = False
        app_label = 'azure_data'
        db_table = 'KCNH2_distances'

    pair_id = models.IntegerField(primary_key=True)
    resnum = models.IntegerField(blank=False, null=False)
    neighbor = models.IntegerField(blank=False, null=False)
    distance = models.IntegerField(blank=False, null=False)

    def __str__(self):
        return self
